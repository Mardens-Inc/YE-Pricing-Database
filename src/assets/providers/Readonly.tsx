import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import $ from "jquery";
import {useLocation, useNavigate} from "react-router-dom";
import {useAlertModal} from "./AlertModalProvider.tsx";

interface ReadonlyContextType
{
    readonly: boolean;
    toggleReadonly: () => Promise<boolean>;
}

const ReadonlyContext = createContext<ReadonlyContextType | undefined>(undefined);

export function ReadonlyProvider({children}: { children: ReactNode })
{
    const [readonly, setReadonly] = useState<boolean>(false);
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const {alert} = useAlertModal();


    const toggleReadonly = async () =>
    {
        const isReadonly = (await $.post("https://yeinv.mardens.com/api/readonly")).is_readonly;
        setReadonly(isReadonly);
        if (isReadonly) navigate("/list");
        return isReadonly;
    };

    useEffect(() =>
    {

        if (pathname !== "/list" && pathname !== "/")
        {
            if (readonly)
            {
                navigate("/list");
                alert({
                    title: "Readonly Mode",
                    message: "This database is currently in readonly mode, please use the full list to view the data.",
                    type: "error",
                    actions: [
                        {
                            label: "Close"
                        }
                    ]
                });
                return;
            }
        }
    }, [pathname]);

    return (
        <ReadonlyContext.Provider value={{readonly, toggleReadonly}}>
            {children}
        </ReadonlyContext.Provider>
    );
}

export function useReadonly(): ReadonlyContextType
{
    const context = useContext(ReadonlyContext);
    if (!context)
    {
        throw new Error("useReadonly must be used within a ReadonlyProvider");
    }
    return context;
}