import { PaymentStatus } from "@/types/apiTypes";
import "./_style.scss";
import { translatePaymentStatus } from "@/utils/translation";

interface IProps {
  tag: PaymentStatus;
}

export const PaymentStatusTag = ({ tag }: IProps) => {
  return (
    <span className={"component payment-status-tag " + tag.toLowerCase()}>
      {translatePaymentStatus[tag]}
    </span>
  );
};
