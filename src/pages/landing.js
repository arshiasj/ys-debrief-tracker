import { Link } from "react-router";

export function Landing() {
    return (
        <>
            <h1>Landing Page</h1>
            <Link to="/slotName">SLOT</Link>
            <Link to="/password">Host</Link>
        </>
    );
}