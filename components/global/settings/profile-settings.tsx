import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileSettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Change your avatar.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src="https://github.com/wesdie.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Separator />
          <div className="flex justify-between gap-2 h-9">
            <Label
              htmlFor="avatar"
              className="text-muted-foreground my-auto font-normal"
            >
              An avatar is optional but strongly recommended.
            </Label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Display name</CardTitle>
          <CardDescription>Change your display name.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            id="display-name"
            placeholder="Enter your display name"
            className="w-[400px]"
          />
          <Separator />
          <div className="flex justify-between gap-2 h-9">
            <Label
              htmlFor="display-name"
              className="text-muted-foreground my-auto font-normal"
            >
              Your display name is how you appear to others on the platform.
            </Label>
            <Button className="w-fit" disabled>
              Change display name
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
          <CardDescription>Change your bio.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            id="bio"
            placeholder="Enter your bio"
            className="w-[400px]"
          />
          <Separator />
          <div className="flex justify-between gap-2 h-9">
            <Label
              htmlFor="bio"
              className="text-muted-foreground my-auto font-normal"
            >
              An avatar is optional but strongly recommended.
            </Label>
            <Button className="w-fit" disabled>
              Change bio
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
