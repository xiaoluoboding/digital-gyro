import { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<{
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    index: {
        type: NumberConstructor;
        default: number;
    };
    size: {
        type: StringConstructor;
        default: string;
    };
    animation: {
        type: PropType<"default" | "wheel" | "countup">;
        default: string;
    };
    duration: {
        type: NumberConstructor;
        default: number;
    };
    stagger: {
        type: BooleanConstructor;
        default: boolean;
    };
    useEase: {
        type: PropType<"Linear" | "Ease">;
        default: string;
    };
    isGyro: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, {
    uuid: string;
    digitHeight: number;
    showRange: (string | number)[];
}, {
    digitWheel(): object;
    digitWheelStyle(): object;
    textStyle(): object;
}, {
    isNumber(val: number): boolean;
    isDigit(val: string): boolean;
    getTanFromDegrees(degrees: number): number;
    ensureDigitClass(val: string): "is-letter" | "is-chinese" | "is-percentage" | "is-digit" | "is-symbol";
    getDigitHeight(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    value: string | number;
    index: number;
    size: string;
    animation: "default" | "wheel" | "countup";
    duration: number;
    stagger: boolean;
    useEase: "Linear" | "Ease";
    isGyro: boolean;
} & {}>, {
    value: string | number;
    index: number;
    size: string;
    animation: "default" | "wheel" | "countup";
    duration: number;
    stagger: boolean;
    useEase: "Linear" | "Ease";
    isGyro: boolean;
}>;
export default _default;
//# sourceMappingURL=DigitWheel.vue?vue&type=script&lang.d.ts.map