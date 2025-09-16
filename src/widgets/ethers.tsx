import { showToast } from "../services/toast";
import getIdenticon from "ethereum-blockies-base64";

export function AddressT({
  className,
  address,
  style,
  iconSize = 28,
  showEmpty,
}: {
  className?: string;
  style?: React.CSSProperties | undefined;
  address: string;
  iconSize?: number | string;
  showEmpty?: boolean;
}) {
  if (!address) return showEmpty ? <div>---</div> : "";

  return (
    <div
      style={{ ...style }}
      className={"text-[#A5A7AA] flex align-center gap-[8px] " + className}
    >
      {address.slice(0, 8)}...{address.slice(-8)}
      <img
        style={{ width: iconSize, height: iconSize, cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard
            .writeText(address)
            .then(() => showToast("Copied!"))
            .catch(() => showToast("Failed to copy"));
        }}
        src="data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2216%22%20fill%3D%22%23011022%22/%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2215.5%22%20stroke%3D%22%234F8FE1%22%20stroke-opacity%3D%220.1%22/%3E%3Cpath%20d%3D%22M8.70898%2013.5007C8.70898%2010.8543%2010.8543%208.70898%2013.5007%208.70898H19.3447C19.6899%208.70898%2019.9697%208.98881%2019.9697%209.33398C19.9697%209.67916%2019.6899%209.95898%2019.3447%209.95898H13.5007C11.5446%209.95898%209.95898%2011.5446%209.95898%2013.5007V19.423C9.95898%2019.7682%209.67916%2020.048%209.33398%2020.048C8.98881%2020.048%208.70898%2019.7682%208.70898%2019.423V13.5007Z%22%20fill%3D%22%234F8FE1%22/%3E%3Cpath%20d%3D%22M21.3361%2011.6617C18.6353%2011.3598%2015.866%2011.3598%2013.1652%2011.6617C12.3958%2011.7477%2011.7775%2012.3532%2011.6869%2013.1285C11.3665%2015.8673%2011.3665%2018.634%2011.6869%2021.3727C11.7775%2022.1481%2012.3958%2022.7536%2013.1652%2022.8396C15.866%2023.1415%2018.6353%2023.1415%2021.3361%2022.8396C22.1055%2022.7536%2022.7238%2022.1481%2022.8145%2021.3728C23.1348%2018.634%2023.1348%2015.8673%2022.8145%2013.1285C22.7238%2012.3532%2022.1055%2011.7477%2021.3361%2011.6617Z%22%20fill%3D%22%234F8FE1%22/%3E%3C/svg%3E"
      />
    </div>
  );
}

export function EthereumBlockie({ address, size, className }: any) {
  if (!address) return "";
  const identicon = getIdenticon(address);
  return (
    <img
      src={identicon}
      alt="Wallet Identicon"
      style={{ width: size, height: size, borderRadius: "50%" }}
      className={className}
    />
  );
}
