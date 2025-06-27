import Image from "next/image";

type CommentProps = {
  comment: string;
  user: {
    name: string;
    description: string;
  };
};

export const CommentCard = ({ comment, user }: CommentProps) => {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-5 rounded-xl bg-[#1E1E1E] p-8 md:h-[356px]">
      <p className="font-roboto line-clamp-5 text-xl font-medium md:text-3xl">
        {comment}
      </p>

      <div className="flex items-center gap-4">
        <div className="h-12 w-12 overflow-hidden rounded-lg md:h-16 md:min-h-16 md:w-16 md:min-w-16">
          <Image
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
            alt="img"
            width={100}
            height={100}
            className="h-full w-full"
          />
        </div>
        <div>
          <p className="font-roboto text-xl font-semibold md:text-2xl">
            {user.name}
          </p>
          <p className="font-roboto gradient-text-yellow text-base font-medium md:text-lg">
            {user.description}
          </p>
        </div>
      </div>
    </div>
  );
};
