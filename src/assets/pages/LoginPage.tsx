import {Button, cn, Input, Switch} from "@nextui-org/react";
import Authentication, {LoginResponse, UserProfile} from "../ts/authentication";
import {useState} from "react";
import EmployeesAutocomplete from "../components/EmployeesAutocomplete.tsx";
import {useNavigate} from "react-router-dom";
import {Employee} from "../ts/useEmployeeList.ts";
import $ from "jquery";


export default function LoginPage({onLogin}: { onLogin: (username: string, password: string, profile: UserProfile, employee: Employee) => void })
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [employeeError, setEmployeeError] = useState("");
    const auth = new Authentication(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const navigate = useNavigate();

    auth.loginWithTokenFromCookie().then(response =>
    {
        try
        {
            if (response !== false && typeof response === "object" && (response as LoginResponse).success)
            {
                navigate("/stores/");
            }
        } catch (e)
        {
            console.error(e);
        }
    });


    const tryToLogin = async () =>
    {
        setLoggingIn(true);
        setError("");
        setUsernameError("");
        setPasswordError("");
        setEmployeeError("");
        if (username === "" || password === "" || employee === null)
        {
            if (username === "")
            {
                setUsernameError("Please fill in this field.");
            }
            if (password === "")
            {
                setPasswordError("Please fill in this field.");
            }
            if (employee === undefined)
            {
                setEmployeeError("Please select an employee.");
            }
            setLoggingIn(false);
            return;
        }
        try
        {
            const response = await auth.login(username, password);
            if (response.success)
            {
                onLogin(username, password, auth.getUserProfile(), employee);
                window.localStorage.setItem("profile", JSON.stringify(auth.getUserProfile()));
                window.localStorage.setItem("employee", JSON.stringify(employee));
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
        setLoggingIn(false);
    };

    $("input").on("keyup", async e =>
    {
        if (e.key === "Enter") await tryToLogin();
    });

    return (
        <div className={"mx-auto w-[90%] sm:w-[90%] md:w-[70%] lg:w-[40%] gap-3 flex flex-col"}>
            <h1 className={"text-6xl mb-10 sm:text-6xl md:text-8xl lg:text-9xl"}>Login</h1>
            <Input label={"Username"} isRequired value={username} onValueChange={value =>
            {
                setUsername(value);
                setUsernameError("");
            }} errorMessage={usernameError} isInvalid={error !== "" || usernameError !== ""}/>
            <Input label={"Password"} type={showPassword ? "text" : "password"} value={password} isRequired onValueChange={value =>
            {
                setPassword(value);
                setPasswordError("");
            }} errorMessage={passwordError} isInvalid={error !== "" || passwordError !== ""}/>
            <EmployeesAutocomplete
                error={employeeError}
                onSelectionChange={item =>
                {
                    setEmployeeError("");
                    setEmployee(item);
                }}/>
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
            <Button color={"primary"} onClick={tryToLogin} radius={"full"} isLoading={loggingIn}>Login</Button>
        </div>
    );
}