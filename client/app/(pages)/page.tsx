import CreateGame from "@/_components/CreateGame";
import HowToPlay from "@/_components/HowToPlay";

export default function Home() {

    return (
        <main className="grid gap-10">
            <CreateGame/>
            <HowToPlay/>
        </main>
    );
}
