/**
 * Application dialog messages used for verifications
 */
export const DIALOG_MESSAGES = {
    EMPTY_PAYMENT_FORM: 'Please fill out Name and Creditcard.'
} as const;

/**
 * Application text constants used for verifications
 * Organized by page/component and message type
 */
export const WEB_ELEMENTS_TEXT = {
    CART: {
        MODALS: {
            ORDER_CONFIRMATION: {
                TITLE: 'Thank you for your purchase!'
            }
        },
        BUTTONS: {
            PLACE_ORDER: 'Place Order',
            PURCHASE: 'Purchase'
        }
    },
    PRODUCT: {
        BUTTONS: {
            ADD_TO_CART: 'Add to cart'
        }
    }
} as const; 