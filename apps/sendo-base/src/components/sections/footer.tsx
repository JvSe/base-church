import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 px-16 pb-14 md:pt-28">
      <div className="flex h-full w-full flex-col items-center gap-10 md:flex-row">
        <div className="flex-1">
          <Image
            src="/assets/svg/sendo-base.svg"
            alt="Sendo Base Logo"
            width={100}
            height={100}
            className="hidden w-[400px] md:block"
          />
          <div className="flex flex-col items-center md:mt-12 md:items-start">
            <p className="text-dark-3 mb-2 text-xl">
              Siga-nos nas redes sociais
            </p>
            <div className="flex items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border">
                <FaFacebookF className="text-2xl" />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border">
                <FaInstagram className="text-2xl" />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border">
                <FaYoutube className="text-2xl" />
              </div>
              <p className="hidden text-xl md:block">/ basechurchpalmas</p>
            </div>
          </div>
        </div>
        <div className="-order-1 flex h-full w-full flex-1 flex-col items-center gap-3 text-center md:order-1 md:items-end md:text-right">
          <Image
            src="/assets/svg/logo/logo-complete.svg"
            alt="Sendo Base Logo"
            width={100}
            height={100}
            className="w-[90px] md:w-[120px]"
          />
          <div className="space-y-1">
            <p className="text-lg font-bold">Base Church Palmas</p>
            <p className="text-lg">
              Qd. 802 Sul, Av. Teotonio Segurado, Plano Diretor Sul, <br />{" "}
              Palmas - TO, 77023-002
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Image
          src="/assets/svg/sendo-base.svg"
          alt="Sendo Base Logo"
          width={100}
          height={100}
          className="mt-4 w-[250px] md:hidden"
        />
        <p>© 2025 Base Church, Inc.</p>
      </div>
    </div>
  );
};
