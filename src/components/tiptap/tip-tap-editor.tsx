"use client";
import { CONTENT_PROSE } from "@/lib/prose";
import { cn } from "@/lib/utils";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { Youtube } from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./tip-tap-tool-bar";

const TipTapEditor = ({
    onValueChange,
    content = "",
    prose,
    autofocus = false,
    className
}: {
    onValueChange: (content: string) => void,
    content: string,
    prose?: string,
    className?: string,
    MAX_WORDS?: number,
    autofocus?: boolean
}) => {
    const editor = useEditor({
        autofocus: autofocus,
        extensions: [
            StarterKit.configure({
                // optionally remove marks you don't need to avoid conflicts
            }),
            TextStyle,
            // Color.configure({ types: ['textStyle'] }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Youtube.configure({
                inline: false,
                controls: true,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
        ],
        content,
        immediatelyRender: false,
        editorProps: {
            attributes: { class: `${prose ?? CONTENT_PROSE} focus:outline-none px-3 py-1!` },
        },
        onUpdate: ({ editor }) => {
            onValueChange(editor.getHTML());
        },

    });

    return (
        <div className={cn("bg-input border flex flex-col items-start w-full justify-start", className)}>
            {!editor ? (
                <></>
            ) : (
                <>
                    <div className="flex w-full justify-start p-2 border-b border-b-black/20">
                        <TipTapMenuBar editor={editor} />
                    </div>

                    <div className="prose max-w-none font-nunito w-full prose-sm">
                        <EditorContent editor={editor} />
                    </div>
                </>
            )}
        </div>
    );
};

export default TipTapEditor;