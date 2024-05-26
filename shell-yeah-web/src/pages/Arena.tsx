import {useParams} from "react-router-dom";

function Arena() {
    const params = useParams()
    console.log(params["arenaId"])
    return (
        <h1>Arena: {params["arenaId"]}</h1>
    )
}

export default Arena