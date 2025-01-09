import $ from "jquery";

export async function is_readonly()
{
    const response = await $.get("https://yeinv.mardens.com/api/readonly");
    return response.is_readonly as boolean;
}

export async function toggle_readonly()
{
    let response = await $.post("https://yeinv.mardens.com/api/readonly");
    return response.is_readonly as boolean;
}