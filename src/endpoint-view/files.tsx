import { JsonEditor } from "./json-editor"

export const FileView = (props: {id: string, file: string}) => {
    return (
         <div>
              <JsonEditor />
        </div>
    )
}