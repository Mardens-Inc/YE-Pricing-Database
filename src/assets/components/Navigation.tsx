import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import {Link} from "@nextui-org/react";
import MardensLogo from "./MardensLogo.tsx";


export default function Navigation()
{

    return (
        <Navbar maxWidth={"full"}>
            <NavbarContent justify="start">
                <NavbarItem className={"font-bold"}>
                    <Link href="/"><MardensLogo height={"2rem"} color={"#f13848"} /></Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>
            </NavbarContent>
        </Navbar>);
}