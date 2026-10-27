import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

interface UserInfoCellProps {
  name: string;
  email: string;
  profilePhoto?: string;
}

function UserInfoCell({ name, email, profilePhoto }: UserInfoCellProps) {
  return (
    <Item>
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src={profilePhoto} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
        <ItemDescription>{email}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export default UserInfoCell;
