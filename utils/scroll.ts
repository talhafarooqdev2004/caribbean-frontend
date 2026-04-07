/**
 * Smooth scroll to an element by its ID
 * @param elementId - The ID of the element to scroll to
 * @param offset - Optional offset in pixels from the top
 */
export const smoothScrollToElement = (elementId: string, offset: number = 80) => {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const targetPosition = elementPosition - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
        });
    }
};
