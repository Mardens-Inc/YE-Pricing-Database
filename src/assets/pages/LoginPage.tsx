import {Button, cn, Input, Switch} from "@nextui-org/react";
import Authentication from "../ts/authentication";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function LoginPage()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = new Authentication(true);
    const navigate = useNavigate();

    auth.loginWithTokenFromCookie().then(res =>
    {
        if (res)
        {
            navigate("/stores/");
        }
    });

    const tryToLogin = async () =>
    {
        setLoading(true);
        setError("");
        setUsernameError("");
        setPasswordError("");
        if (username === "" || password === "")
        {
            if (username === "")
            {
                setUsernameError("Please fill in this field.");
            }
            if (password === "")
            {
                setPasswordError("Please fill in this field.");
            }
            setLoading(false);
            return;
        }
        try
        {
            const response = await auth.login(username, password);
            if (response.success)
            {
                navigate("/stores/");
            } else
            {
                if (response.message === "Invalid username or password.")
                {
                    setUsernameError("Invalid username");
                    setPasswordError("Invalid password");
                }
                setError(response.message);
            }
        } catch (e: any)
        {
            console.error(e);
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <div className={"mx-auto w-[40%] gap-3 flex flex-col"}>
            <h1 className={"text-9xl mb-10"}>Login</h1>
            <Input label={"Username"} value={username} onValueChange={value =>
            {
                setUsername(value);
                setUsernameError("");
            }} errorMessage={usernameError} isInvalid={error !== "" || usernameError !== ""}/>
            <Input label={"Password"} type={showPassword ? "text" : "password"} value={password} onValueChange={value =>
            {
                setPassword(value);
                setPasswordError("");
            }} errorMessage={passwordError} isInvalid={error !== "" || passwordError !== ""}/>
            <Switch
                onValueChange={setShowPassword}
                classNames={{
                    base: cn(
                        "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
                        "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary"
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn("w-6 h-6 border-2 shadow-lg",
                        "group-data-[hover=true]:border-primary",
                        //selected
                        "group-data-[selected=true]:ml-6",
                        // pressed
                        "group-data-[pressed=true]:w-7",
                        "group-data-[selected]:group-data-[pressed]:ml-4"
                    )
                }}
            >
                <div className="flex flex-col gap-1">
                    <p className="text-medium">Show Password</p>
                    <p className="text-tiny text-default-400">
                        <b>Warning:</b> This will make the password field visible.
                    </p>
                </div>
            </Switch>
            {error && <p className={"text-red-500"}>{error}</p>}
            <Button color={"primary"} onClick={tryToLogin} radius={"full"} isLoading={loading}>Login</Button>
        </div>
    );
}