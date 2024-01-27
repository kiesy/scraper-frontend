import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./dropdownmenu"

export default function MoreOptionsRowButton({setIsEditing, duplicateProduct, deleteProduct}) {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger><MoreHorizontal /></DropdownMenuTrigger>
        <DropdownMenuContent className={'bg-white'}>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={setIsEditing}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={duplicateProduct}>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Back To Original</DropdownMenuItem>
            <DropdownMenuItem onClick={deleteProduct}>Delete</DropdownMenuItem>

        </DropdownMenuContent>
        </DropdownMenu>

    )
}