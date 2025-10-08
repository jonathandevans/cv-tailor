"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "../providers/session";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { LogOut, Monitor, Moon, Sun, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function UserButton() {
  const router = useRouter();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex gap-2 items-center text-md tracking-tight p-2 border rounded-md">
          <Avatar className="rounded-md">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="bg-blue-500 font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {user.name}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <User className="size-4 text-foreground" /> Account
        </DropdownMenuItem>
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {theme === "light" ? (
              <Sun className="size-4 text-foreground" />
            ) : theme === "dark" ? (
              <Moon className="size-4 text-foreground" />
            ) : (
              <Monitor className="size-4 text-foreground" />
            )}
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuCheckboxItem
              checked={theme === "light"}
              disabled={theme === "light"}
              onClick={() => {
                setTheme("light");
              }}
            >
              Light
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === "dark"}
              disabled={theme === "dark"}
              onClick={() => {
                setTheme("dark");
              }}
            >
              Dark
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === "system"}
              disabled={theme === "system"}
              onClick={() => {
                setTheme("system");
              }}
            >
              System
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/");
                  queryClient.clear();
                },
              },
            });
          }}
        >
          <LogOut className="size-4 text-foreground" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
