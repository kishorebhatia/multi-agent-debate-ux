'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FileUpload({ onUpload }) {
  const [files, setFiles] = useState([])

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles)
    onUpload(acceptedFiles)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  })

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-6 
          transition-colors duration-200 ease-in-out
          ${isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-primary'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-4">
          <div className="text-4xl">📄</div>
          {isDragActive ? (
            <p className="text-primary">Drop files here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">Drag & drop files here</p>
              <p className="text-gray-400 text-sm">or</p>
              <button className="btn btn-primary btn-sm">
                Select Files
              </button>
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Selected Files:</p>
          <ul className="text-sm space-y-1">
            {files.map((file: any) => (
              <li key={file.name} className="flex items-center gap-2">
                <span className="text-primary">📄</span>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
