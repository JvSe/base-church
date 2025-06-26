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
    <div className="bg-[#1E1E1E] w-full h-[356px] flex flex-col justify-between rounded-xl p-8">
      <p className="font-medium font-roboto text-3xl line-clamp-5">{comment}</p>

      <div className="flex items-center gap-4">
        <div className="min-w-16 min-h-16 w-16 h-16  rounded-lg overflow-hidden">
          <Image
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
            alt="img"
            width={100}
            height={100}
            className="w-full h-full"
          />
        </div>
        <div>
          <p className="font-roboto text-2xl font-semibold">{user.name}</p>
          <p className="font-roboto font-medium text-lg gradient-text-yellow">
            {user.description}
          </p>
        </div>
      </div>
    </div>
  );
};
