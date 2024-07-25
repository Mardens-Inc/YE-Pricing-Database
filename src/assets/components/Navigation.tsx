import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import {Link} from "@nextui-org/react";

export default function Navigation()
{

    return (
        <Navbar maxWidth={"full"}>
            <NavbarContent justify="start">
                <NavbarItem className={"font-bold"}>
                    <Link href="/">Years End Inventory Pricing Database</Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>
            </NavbarContent>
        </Navbar>);
}