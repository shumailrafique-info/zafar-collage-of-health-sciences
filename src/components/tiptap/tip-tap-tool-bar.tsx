import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Editor, useEditorState } from "@tiptap/react";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Italic,
    Link2,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Type,
    Underline,
    Undo
} from "lucide-react";

const TipTapMenuBar = ({ editor }: { editor: Editor }) => {
    const state = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold: ctx.editor.isActive("bold"),
            isItalic: ctx.editor.isActive("italic"),
            isUnderline: ctx.editor.isActive("underline"),
            isStrike: ctx.editor.isActive("strike"),
            isBlockquote: ctx.editor.isActive("blockquote"),
            isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
            isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
            isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
            isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),
            isLink: ctx.editor.isActive("link"),
            canUndo: ctx.editor.can().undo(),
            canRedo: ctx.editor.can().redo(),
        }),
    });

    const setLink = () => {
        const url = prompt('Enter URL');
        if (url) {
            editor.chain().focus().toggleLink({ href: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {/* Text Formatting */}
            <div className="flex gap-2 border-r pr-2 border-gray-200">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isBold
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <Bold className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isItalic
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <Italic className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isUnderline
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <Underline className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isStrike
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <Strikethrough className="w-3 h-3" />
                </button>

                {/* Headings Popover */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="p-2 aspect-square rounded-md transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        >
                            <Type className="w-3 h-3" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 bg-white border border-gray-200 shadow-md">
                        <div className="grid grid-cols-2 gap-1">
                            {[1, 2, 3, 4, 5, 6].map((level) => (
                                <button
                                    key={level}
                                    onClick={() =>
                                        editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
                                    }
                                    className={cn(
                                        "h-8 rounded-md text-xs font-medium transition-colors",
                                        editor.isActive("heading", { level })
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                    type="button"
                                >
                                    H{level}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Text Alignment */}
            <div className="flex gap-2 border-r border-gray-200 pr-2">
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isAlignLeft
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <AlignLeft className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isAlignCenter
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <AlignCenter className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isAlignRight
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <AlignRight className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isAlignJustify
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <AlignJustify className="w-3 h-3" />
                </button>
            </div>

            {/* Lists & Blockquote */}
            <div className="flex gap-2 border-r pr-2 border-gray-200">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        editor.isActive("bulletList")
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <List className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        editor.isActive("orderedList")
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <ListOrdered className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isBlockquote
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    type="button"
                >
                    <Quote className="w-3 h-3" />
                </button>
            </div>

            {/* Links */}
            <div className="flex gap-2 border-r pr-2 border-gray-200">
                <button
                    type="button" onClick={setLink}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.isLink
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <Link2 className="w-3 h-3" />
                </button>
            </div>

            {/* History */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!state.canUndo}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.canUndo
                            ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            : "text-gray-300 cursor-not-allowed opacity-50"
                    )}
                >
                    <Undo className="w-3 h-3" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!state.canRedo}
                    className={cn(
                        "p-2 aspect-square rounded-md transition-colors",
                        state.canRedo
                            ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            : "text-gray-300 cursor-not-allowed opacity-50"
                    )}
                >
                    <Redo className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

export default TipTapMenuBar;