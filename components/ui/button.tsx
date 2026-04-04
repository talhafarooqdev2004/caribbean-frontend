import clsx from "clsx";
import styles from "./Button.module.scss";

type Button = React.PropsWithChildren<{
    variant?: "primary" | "secondary" | "outline",
    size?: "md" | "lg",
    className?: string,
}>;

export default function Button({ children, variant = "primary", size = "lg", className = "" }: Button) {
    const variants = {
        primary: styles.primary,
        secondary: styles.secondary,
        outline: styles.outline,
    };

    const sizes = {
        md: styles.md,
        lg: styles.lg,
    };

    return (
        <button className={clsx(
            styles.button,
            variants[variant],
            sizes[size],
            className
        )}
        >
            {children}
        </button>
    );
};