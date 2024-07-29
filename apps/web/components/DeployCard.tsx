"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import axios from "axios"
import { useDispatch, useSelector, } from "react-redux";
import { selectSocket, socketConnect, socketEmit } from "@/lib/redux/socketSlice";
import { clearLogs } from "@/lib/redux/logSlice";

type env = {
    name: string,
    value: string
}

const backendUrl = process.env.NEXT_PUBLIC_DEPLOY_SERVER

const DeployCard = () => {
    const [framework, setFramework] = React.useState("Node.js")
    const [envCount, setEnvCount] = React.useState(1)
    const [env, setEnv] = React.useState(false)
    const [envFields, setEnvFields] = React.useState<env[]>([])
    const [github, setGithub] = React.useState("")
    const [projectName, setProjectName] = React.useState("")
    const [port, setPort] = React.useState("")
    const [projectNameError, setProjectNameError] = React.useState<string>("");
    const [dir, setDir] = React.useState<string>("")
    const [deploying, setDeploying] = React.useState(false)

    const dispatch = useDispatch();
    const socket = useSelector(selectSocket);


    useEffect(() => {
        setEnvFields(prevFields => {
            if (prevFields.length > envCount) {
                return prevFields.slice(0, envCount);
            } else {
                return prevFields;
            }
        });
    }, [envCount]);

    const deploy = async () => {
        if (projectNameError) {
            alert("Please fix the project name error before deploying");
            return;
        }

        if (!github || !projectName) {
            alert("Please enter the github url and project name before deploying");
            return;
        }
        if (socket.disconnected) {
            dispatch(socketConnect());
        }
        dispatch(clearLogs())
        console.log("Subscribing to logs");
        dispatch(socketEmit({ event: "subscribe", data: projectName }));
        setDeploying(true);

        if (framework == "Node.js") {
            const response = await axios.post(`${backendUrl}/publishNode`, {
                port: port,
                project_name: projectName,
                github_url: github,
                env: envFields.length === 0 ? null : envFields,
                src_dir: dir
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            console.log(response.data);
        } else {
            const response = await axios.post(`${backendUrl}/publishVite`, {
                project_name: projectName,
                github_url: github,
                env: envFields
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            console.log(response.data);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Repositry details</CardTitle>
                <CardDescription>Enter the details for the repository you want to deploy.</CardDescription>
            </CardHeader>
            <CardDescription>
                <CardContent className="text-base font-medium font-sans space-y-3">
                    <div>Github repository url</div>
                    <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        setGithub(e.target.value)
                    }} type="url" placeholder="Enter your repository url"></Input>
                </CardContent>
            </CardDescription>
            <CardDescription>
                <CardContent className="items-center flex flex-row justify-between text-base font-medium font-sans space-y-3">
                    <div>Framework</div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="text-gray-700 gap-1">{framework}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Select framework</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={framework} onValueChange={setFramework}>
                                <DropdownMenuRadioItem value="Node.js">Node.js</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Vite">Vite</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardContent>
            </CardDescription>
            <CardDescription className="flex  flex-col">
                <CardContent className="items-center flex flex-row justify-between text-base font-medium font-sans space-y-3">
                    <div>Project name</div>
                    <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        if (e.target.value.includes('_') || e.target.value.includes(' ')) {
                            setProjectNameError('Project name cannot contain underscores or spaces');
                        } else if (e.target.value.length > 50) {
                            setProjectNameError('Project name is too long');
                        } else {
                            setProjectNameError('');
                        }

                        setProjectName(e.target.value)
                    }} type="url" className="w-1/3"></Input>
                </CardContent>
                {projectNameError && <div className="text-red-500 self-end pr-5">{projectNameError}</div>}
            </CardDescription>
            {framework === "Node.js" ? <> <CardDescription>
                <CardContent className="items-center flex flex-row justify-between text-base font-medium font-sans space-y-3">
                    <div>Port</div>
                    <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        setPort(e.target.value)
                    }} type="number" className="w-1/3"></Input>
                </CardContent>
            </CardDescription>
                <CardDescription>
                    <CardContent className="items-center flex flex-row justify-between text-base font-medium font-sans space-y-3">
                        <div>Source directory</div>
                        <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.preventDefault();
                            setDir(e.target.value)
                        }} type="text" className="w-1/3"></Input>
                    </CardContent>
                </CardDescription>
            </>
                : <></>}
            <CardDescription>
                <CardContent className="items-center flex flex-row justify-between text-base font-medium font-sans space-y-3">
                    <div>Environment variables</div>
                    <Checkbox checked={env} onCheckedChange={(check: any) => {
                        setEnv(check.valueOf().toString() == "true" ? true : false)
                        if (envCount == 0) setEnvCount(1)
                    }
                    }></Checkbox>
                </CardContent>
                {env ?
                    <div className="space-y-2">
                        {envFields.map((_, i) => {
                            return (
                                <CardContent key={i} className="pb-0 items-center flex flex-row justify-between text-base font-medium font-sans">
                                    <Input type="text" className="w-1/3 " placeholder={`ENV_KEY`} onChange={
                                        (e: React.ChangeEvent<HTMLInputElement>) => {
                                            e.preventDefault();
                                            const newFields = [...envFields];
                                            if (!newFields[i]) {
                                                newFields[i] = { name: "", value: "" };
                                            }
                                            newFields[i]!.name = e.target.value;
                                            console.log(newFields)
                                            setEnvFields(newFields);
                                        }
                                    }></Input>
                                    <Input
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            e.preventDefault();
                                            const newFields = [...envFields];
                                            if (!newFields[i]) {
                                                newFields[i] = { name: "", value: "" };
                                            }
                                            newFields[i]!.value = e.target.value;
                                            console.log(newFields)
                                            setEnvFields(newFields);
                                        }}
                                        type="text" className="w-7/12" placeholder={`ENV_VALUE`}></Input>
                                </CardContent>
                            );
                        })}
                    </div>
                    : <></>
                }
                {env ? <CardContent className=" flex flex-row justify-end font-sans">
                    <Button onClick={() => {
                        setEnvCount(envCount + 1)
                    }} variant="link" className="text-xs text-gray-500">Add +</Button>
                    <Button onClick={() => {
                        if (envCount == 1) {
                            setEnv(false);
                        }
                        setEnvCount(envCount - 1)
                    }} variant="link" className="text-xs text-gray-500">Remove -</Button>
                </CardContent> : <></>}
            </CardDescription>
            <CardFooter className="flex justify-center">
                <Button onClick={deploy} disabled={deploying}>Deploy</Button>
            </CardFooter>
        </Card>
    )
}

export default DeployCard