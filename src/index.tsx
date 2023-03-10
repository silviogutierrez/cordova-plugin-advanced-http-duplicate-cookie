import * as React from "react";
import {createRoot} from "react-dom/client";
import {Capacitor} from "@capacitor/core";

declare global {
    interface Window {
        cordova?: {
            plugin: {
                http: {
                    clearCookies: () => void;
                    getCookieString: (domain: string) => string;
                    downloadFile: (
                        url: string,
                        parameters: Record<never, never>,
                        headers: Record<never, never>,
                        uri: string,
                        onSuccess: () => void,
                        onError: (error: unknown) => void,
                    ) => void;

                    sendRequest: (
                        url: string,
                        options: {
                            method:
                                | "get"
                                | "post"
                                | "put"
                                | "patch"
                                | "head"
                                | "delete"
                                | "options"
                                | "upload"
                                | "download";
                            data?: FormData;
                            serializer?:
                                | "json"
                                | "urlencoded"
                                | "utf8"
                                | "multipart"
                                | "raw";
                            headers?: Record<string, string>;
                            followRedirect: false;
                        },
                        onSuccess: (response: {
                            status: number;
                            data: string;
                            headers: Record<string, string>;
                        }) => void,
                        onError: (response: {
                            status: number;
                            error: string;
                            headers: Record<string, string>;
                        }) => void,
                    ) => void;
                };
            };
        };
    }
}

const BASE_URL = "http://10.0.2.2:3000";

const root = createRoot(document.getElementById("root")!);

const makeRandomString = () => (Math.random() + 1).toString(36).substring(2);

const makeRequest = (HTTP: NonNullable<typeof window.cordova>["plugin"]["http"], url: string) => {
    return new Promise<Response>((resolve) => {
        HTTP.sendRequest(
            `${BASE_URL}${url}`,
            {
                method: "post",
                data: new FormData(),
                serializer: "multipart",
                followRedirect: false,
                headers: {
                },
            },
            (response) => {
                resolve(
                    new Response(response.data, {
                        status: response.status,
                        headers: response.headers,
                    }),
                );
            },
            (response) => {
                resolve(
                    new Response(response.error, {
                        status: response.status,
                        headers: response.headers,
                    }),
                );
            },
        );
    });
}


const setThenReadCookie = async () => {
    if (window.cordova == null) {
        return false;
    }

    const name = makeRandomString();
    const value = makeRandomString();
    console.log("SETTING", name, value);

    await makeRequest(window.cordova.plugin.http, `/api/set-cookie/${name}/${value}/`)
    const response = await makeRequest(window.cordova.plugin.http, `/api/read-cookie/${value}/`)
    const {headerCount} = await response.json();
    /*
    return document.cookie.includes(toSet);
    const cookieName = makeRandomString();
    const cookieValue = makeRandomString();
    setCookie(cookieName, cookieValue);

    const response = await fetch(`${BASE_URL}/api/read-cookie/${cookieName}`);
    const {value} = await response.json();
    return value == cookieValue;
    */

    alert(`Cookie header is present ${headerCount} times`);
    return headerCount == 1;
};

interface TestCase {
    (): Promise<boolean>;
    issue?: string;
}

const Test = (props: {name: string; test: TestCase}) => {
    const [passed, setPassed] = React.useState(false);

    const runTest = () => {
        props
            .test()
            .then((passed) => {
                setPassed(passed);
            })
            .catch(() => setPassed(false));
    }

    React.useEffect(() => {
        runTest();
    }, []);

    return (
        <div style={{lineHeight: 1}}>
            <h3 style={{marginTop: 0, marginBottom: 0}}>
                {props.name}{" "}
            </h3>
            {passed == true && (
                <h5 style={{marginTop: 0, marginBottom: 0, color: "green"}}>Passed</h5>
            )}
            {passed == false && (
                <h5 style={{marginTop: 0, marginBottom: 0, color: "red"}}>Failed</h5>
            )}
            <button onClick={runTest}>Re-Run</button>
        </div>
    );
};

const Tests = (props: {tests: Record<string, TestCase>}) => {
    return (
        <div>
            {Object.entries(props.tests).map(([name, test]) => {
                return <Test key={name} name={name} test={test} />;
            })}
        </div>
    );
};

setTimeout(() => {

root.render(
    <div>
        <Tests
            tests={{
                setThenReadCookie,
            }}
        />
    </div>,
);
}, 1000);
