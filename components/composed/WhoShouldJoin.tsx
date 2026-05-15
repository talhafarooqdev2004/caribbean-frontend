import styles from "./WhoShouldJoin.module.scss";

import { Container } from "../layout";
import { SvgIcon } from "../ui";

export default function WhoShouldJoin() {
    return (
        <section className={styles.whoThisIsFor}>
            <Container className={styles.whoThisIsForInner}>
                <h1>Who Should Join</h1>

                <p>Carib Newswire is designed for media professionals who cover Caribbean news and communities, including:</p>

                <Roles>
                    <Role icon="journalists-and-reporters">Journalists and reporters</Role>
                    <Role icon="editors-and-producers">Editors and producers</Role>
                    <Role icon="radio-and-television-hosts">Radio and television hosts</Role>
                    <Role icon="podcasters-and-digital-creators">Podcasters and digital creators</Role>
                    <Role icon="bloggers-covering-caribbean-topics">Bloggers covering Caribbean topics</Role>
                    <Role icon="news-organizations-and-media-outlets">News organizations and media outlets</Role>
                </Roles>
            </Container>
        </section>
    );
};

function Roles({ children }: React.PropsWithChildren) {
    return <div className={styles.roles}>{children}</div>;
};

function Role({ icon, children }: React.PropsWithChildren<{ icon: "journalists-and-reporters" | "editors-and-producers" | "radio-and-television-hosts" | "podcasters-and-digital-creators" | "bloggers-covering-caribbean-topics" | "news-organizations-and-media-outlets" }>) {
    return (
        <div className={styles.role}>
            <div className={styles.iconWrapper}>
                <SvgIcon icon={icon} />
            </div>
            <span>{children}</span>
        </div>
    );
};