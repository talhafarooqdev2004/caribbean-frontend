import styles from "./Container.module.scss";

type ContainerProps = React.PropsWithChildren<{
    className?: string;
}>;

export default function Container({ children, className }: ContainerProps) {
    return (
        <div className={`${styles.container} ${className ?? ""}`}>
            {children}
        </div>
    );
};