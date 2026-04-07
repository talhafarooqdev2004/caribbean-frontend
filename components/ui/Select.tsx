import styles from "./Select.module.scss";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<{ value: string; label: string }>;
};

export default function Select({ className = "", options, ...props }: SelectProps) {
    return (
        <select
            {...props}
            className={`${styles.select} ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
