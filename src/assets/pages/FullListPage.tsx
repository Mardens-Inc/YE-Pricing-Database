import DatabaseListComponent from "../components/DatabaseListComponent.tsx";

export default function FullListPage()
{
    return (
        <div>
            <DatabaseListComponent isRefreshing={false} limit={10}/>
        </div>
    );
}