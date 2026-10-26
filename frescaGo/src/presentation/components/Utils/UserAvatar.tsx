import { RiUserLine } from "react-icons/ri";
import type { User } from "../../../domain/user";

interface UserAvatarProps {
  user: Pick<User, "avatar" | "firstName" | "lastName"> | null;
  className?: string;
}

const initialsOf = (user: UserAvatarProps["user"]): string =>
  [user?.firstName, user?.lastName]
    .map((name) => name?.trim().charAt(0) ?? "")
    .join("")
    .toUpperCase();

const UserAvatar = ({ user, className = "h-10 w-10" }: UserAvatarProps) => {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt=""
        className={`rounded-full border border-line object-cover ${className}`}
      />
    );
  }

  const initials = initialsOf(user);

  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full border border-gray-300 bg-soft font-display font-bold text-brand ${className}`}
    >
      {initials || <RiUserLine className="h-1/2 w-1/2" />}
    </span>
  );
};

export default UserAvatar;
