import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = React.PropsWithChildren<{
    variant?: "primary" | "secondary" | "outline" | "form",
    size?: "md" | "lg",
    className?: string,
} & React.ButtonHTMLAttributes<HTMLButtonElement>>;

export default function Button({ children, variant = "primary", size = "lg", className = "", ...props }: ButtonProps) {
    const variants = {
        primary: styles.primary,
        secondary: styles.secondary,
        outline: styles.outline,
        form: styles.form,
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
        )} {...props}>
            {children}
        </button>
    );
};
