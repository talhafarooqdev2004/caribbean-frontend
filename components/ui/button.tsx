import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = React.PropsWithChildren<
  {
    variant?:
      | "primary"
      | "secondary"
      | "outline"
      | "outline-black"
      | "form"
      | "newsroom-filter"
      | "newsroom-category"
      | "slider"
      | "join-the-network"
      | "join-as-media";
    size?: "md" | "lg";
    className?: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>;

export default function Button({
  children,
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
    "outline-black": styles.outline + " " + styles.outlineBlack,
    form: styles.form,
    "newsroom-filter": styles.newsRoomFilter,
    "newsroom-category": styles.newsRoomCategory,
    slider: styles.slider,
    "join-the-network": styles.JoinTheNetwork,
    "join-as-media": styles.outline + " " + styles.joinAsMedia,
  };

  const sizes = {
    md: styles.md,
    lg: styles.lg,
  };

  return (
    <button
      className={clsx(styles.button, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
