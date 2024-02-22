import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
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

const DeployCard = () => {
    const [fw, setFw] = React.useState("Node.js")
    const [envCount, setEnvCount] = React.useState(1)
    const [env, setEnv] = React.useState(false)

    const EnvFields = () => {
        const fields = []
        for (let i = 0; i < envCount; i++) {
            fields.push(
                <CardContent key={i} className="pb-0 items-center flex flex-row justify-between text-base font-medium font-sans">
                    <Input type="text" className="w-1/3 " placeholder={`ENV_KEY`}></Input>
                    <Input type="text" className="w-7/12" placeholder={`ENV_VALUE`}></Input>
                </CardContent>
            )
        }
        return fields
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
                    <Input type="url" placeholder="Enter your repository url"></Input>
                </CardContent>
            </CardDescription>
            <CardDescription>
                <CardContent className="items-center flex flex-row justify-between text-base font-medium font-sans space-y-3">
                    <div>Framework</div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="text-gray-700 gap-1">{fw}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Select framework</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={fw} onValueChange={setFw}>
                                <DropdownMenuRadioItem value="Node.js">Node.js</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Vite">Vite</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardContent>
            </CardDescription>
            <CardDescription>
                <CardContent className="items-center flex flex-row justify-between text-base font-medium font-sans space-y-3">
                    <div>Project name</div>
                    <Input type="url" className="w-1/3"></Input>
                </CardContent>
            </CardDescription>
            <CardDescription>
                <CardContent className="items-center flex flex-row justify-between text-base font-medium font-sans space-y-3">
                    <div>Environment variables</div>
                    <Checkbox checked={env} onCheckedChange={(check) => {
                        setEnv(check.valueOf().toString() == "true" ? true : false)
                        if (envCount == 0) setEnvCount(1)
                    }

                    }></Checkbox>
                </CardContent>
                {env ?
                    <div className="space-y-2">
                        {EnvFields()}
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
                <Button>Deploy</Button>
            </CardFooter>
        </Card>
    )
}

export default DeployCard