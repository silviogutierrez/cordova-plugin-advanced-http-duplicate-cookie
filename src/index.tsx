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

const BASE_URL = "https://doesthiswork.joyhealthtracker.dev";

const root = createRoot(document.getElementById("root")!);

const makeRandomString = () => (Math.random() + 1).toString(36).substring(2);

const makeRequest = (HTTP: NonNullable<typeof window.cordova>["plugin"]["http"], url: string, data: FormData | null) => {
    console.log( `${BASE_URL}${url}`)
    return new Promise<Response>((resolve) => {
        HTTP.sendRequest(
            `${BASE_URL}${url}`,
            {
                method: data == null ? "get" : "post",
                data: data ?? undefined,
                serializer: "multipart",
                followRedirect: false,
                headers: {
                },
            },
            (response) => {
                console.log("[Client] Response headers", response.headers);
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

    const HTTP = window.cordova.plugin.http;

    const name = makeRandomString();
    const value = makeRandomString();
    console.log("SETTING", name, value);

    const formData = new FormData();
    formData.append("username", "silviogutierrez@gmail.com")
    formData.append("password", "test")

    await makeRequest(HTTP, "/api/functional-rpc/rpc_login/", formData);
    await makeRequest(HTTP, "/api/functional-rpc-init_context/rpc_init/", null);

    const data = await (await makeRequest(HTTP, "/api/functional-rpc-init_context/rpc_init/", null)).json();
    console.log(data);
    return data.profile != null;
    /*
    /*
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
    return true;
    // return headerCount == 1;
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
