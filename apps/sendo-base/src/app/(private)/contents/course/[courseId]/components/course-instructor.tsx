import { addPastorPrefix } from "@/src/lib/helpers";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@base-church/ui/components/avatar";
import { User } from "lucide-react";

type CourseInstructorProps = {
  instructor: any;
};

export function CourseInstructor({ instructor }: CourseInstructorProps) {
  return (
    <div className="dark-glass dark-shadow-sm rounded-xl p-6">
      <h2 className="dark-text-primary mb-6 text-xl font-bold">
        Seu Instrutor
      </h2>

      <div className="flex items-start gap-6">
        <Avatar className="group-hover:ring-primary h-24 w-24 ring-2 ring-transparent transition-all duration-200">
          <AvatarImage
            src={instructor?.image ?? ""}
            alt={instructor?.name ?? "Foto do perfil"}
            className="object-cover"
          />
          <AvatarFallback className="dark-primary-subtle-bg rounded-full p-4">
            <User className="dark-primary" size={32} />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="dark-text-primary mb-1 text-lg font-semibold">
            {addPastorPrefix(instructor?.name, instructor?.isPastor) ||
              "Instrutor não informado"}
          </h3>

          <p className="dark-text-secondary leading-relaxed">
            {instructor?.bio || "Biografia não disponível"}
          </p>
        </div>
      </div>
    </div>
  );
}
