import styles from "./Select.module.scss";

export type SelectOption = {
    value: string;
    label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: ReadonlyArray<SelectOption>;
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
