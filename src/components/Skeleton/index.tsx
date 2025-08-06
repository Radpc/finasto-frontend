import React from "react";
import "./_style.scss";

interface IProps {
  className?: string;
  height?: string;
  width?: string;
  children?: React.ReactNode;
}

const Skeleton = ({ className, height, width, children }: IProps) => {
  return (
    <div
      style={{ height, width }}
      className={`component-skeleton ${className ?? ""} shimmer`}
    >
      {children}
    </div>
  );
};

const LoadingLines = ({
  lines,
  length = 1,
}: {
  lines: number;
  length?: number;
}) => (
  <>
    {[...Array.from({ length: lines })].map((_, i) => (
      <LoadingLine key={i} length={length} />
    ))}
  </>
);

const LoadingLine = ({ length }: { length: number }) => (
  <tr className="component loading-line">
    {[...Array.from({ length })].map((_, i) => (
      <td key={"loading_line_" + i}>
        <Skeleton>
          <div className="line" />
        </Skeleton>
      </td>
    ))}
  </tr>
);

const LoadingItem = ({
  length = 1,
  rows = 2,
  className,
}: {
  length?: number;
  rows?: number;
  className?: string;
}) => {
  return (
    <Skeleton className={className ? className : undefined}>
      {[...Array.from({ length })].map((_, i) => (
        <div key={"loading-component-item" + i} className="loading-item">
          <div className="circle element" />
          <div className="rows">
            {[...Array.from({ length: rows })].map((_, i) => (
              <div key={"loading-component" + i} className="row element" />
            ))}
          </div>
        </div>
      ))}
    </Skeleton>
  );
};

export { Skeleton, LoadingLine, LoadingLines, LoadingItem };
