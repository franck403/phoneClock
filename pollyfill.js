# pollyfill drag and drop for mobile as it not supported

document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('[draggable="true"]');

    let offsetX, offsetY;
    let isDragging = false;
    let currentElement = null;

    const addShadow = (element) => {
        element.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    };

    const removeShadow = (element) => {
        element.style.boxShadow = 'none';
    };

    const dispatchDragEvent = (element, eventType) => {
        const event = new CustomEvent(eventType, {
            bubbles: true,
            cancelable: true,
            detail: {
                clientX: currentElement ? currentElement.offsetLeft + offsetX : 0,
                clientY: currentElement ? currentElement.offsetTop + offsetY : 0
            }
        });
        element.dispatchEvent(event);
    };

    const onTouchStart = (e) => {
        const touch = e.touches[0];
        offsetX = touch.clientX - currentElement.offsetLeft;
        offsetY = touch.clientY - currentElement.offsetTop;
        isDragging = true;
        addShadow(currentElement);
        dispatchDragEvent(currentElement, 'dragstart');
    };

    const onTouchMove = (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        currentElement.style.left = `${touch.clientX - offsetX}px`;
        currentElement.style.top = `${touch.clientY - offsetY}px`;
        dispatchDragEvent(currentElement, 'dragover');
    };

    const onTouchEnd = () => {
        isDragging = false;
        removeShadow(currentElement);
        dispatchDragEvent(currentElement, 'dragend');
        currentElement = null;
    };

    draggables.forEach(element => {
        element.addEventListener('touchstart', (e) => {
            currentElement = element;
            onTouchStart(e);
        });

        element.addEventListener('touchmove', onTouchMove);

        element.addEventListener('touchend', onTouchEnd);
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    // Automatically detect and apply the polyfill if necessary
    const isTouchDevice = () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    };

    if (isTouchDevice()) {
        console.log('Touch device detected. Applying drag-and-drop polyfill.');
        // Additional initialization code for the polyfill can go here if needed
    }
});