import styles from "./FormControl.module.scss";

type FormControlProps = React.PropsWithChildren<{
    className?: string;
}>;

export default function FormControl({ children, className = "" }: FormControlProps) {
    return <div className={`${styles.formControl} ${className}`}>{children}</div>;
};
