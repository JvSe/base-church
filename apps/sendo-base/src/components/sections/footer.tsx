import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full h-full px-16 pt-28 pb-14">
      <div className="flex w-full items-center h-full">
        <div className="flex-1">
          <Image
            src="/assets/svg/sendo-base.svg"
            alt="Sendo Base Logo"
            width={100}
            height={100}
            className="w-[400px]"
          />
          <div className="mt-12">
            <p className="text-xl text-dark-3 mb-2">
              Siga-nos nas redes sociais
            </p>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border">
                <FaFacebookF className="text-2xl" />
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center border">
                <FaInstagram className="text-2xl" />
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center border">
                <FaYoutube className="text-2xl" />
              </div>
              <p className="text-xl">/ basechurchpalmas</p>
            </div>
          </div>
        </div>
        <div className="flex-1 gap-3 text-right flex flex-col items-end w-full h-full">
          <Image
            src="/assets/svg/logo/logo-complete.svg"
            alt="Sendo Base Logo"
            width={100}
            height={100}
            className="w-[120px]"
          />
          <div className="space-y-1">
            <p className="font-bold text-lg">Base Church Palmas</p>
            <p className="text-lg">
              Qd. 802 Sul, Av. Teotonio Segurado, Plano Diretor Sul, <br />{" "}
              Palmas - TO, 77023-002
            </p>
          </div>
        </div>
      </div>

      <p>© 2025 Base Church, Inc.</p>
    </div>
  );
};
