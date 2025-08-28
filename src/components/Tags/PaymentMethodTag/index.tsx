import { PaymentMethod } from "@/types/apiTypes";
import "./_style.scss";
import { translatePaymentMethod } from "@/utils/translation";

interface IProps {
  tag: PaymentMethod;
}

export const PaymentMethodTag = ({ tag }: IProps) => {
  return (
    <span className={"component payment-method-tag " + tag.toLowerCase()}>
      {translatePaymentMethod[tag]}
    </span>
  );
};
