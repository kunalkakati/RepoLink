"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

interface ReadMoreProps {
  text: string
  wordLimit?: number
  className?: string
}

export default function ReadMore({
  text,
  wordLimit = 30,
  className = "",
}: ReadMoreProps) {
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const words = text.trim().split(/\s+/)
  const isLong = words.length > wordLimit
  const displayText = isLong ? words.slice(0, wordLimit).join(" ") + "…" : text

  useEffect(() => {
    if (!showModal) return

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [showModal])

  return (
    <div className={className}>
      <p className="text-sm leading-6 text-slate-500">{displayText}</p>

      {isLong && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
        >
          Read more
        </button>
      )}

      {/* Floating modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div
            ref={modalRef}
            className="relative flex flex-col w-full max-w-lg max-h-[80vh] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-700 tracking-tight">
                Description
              </span>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 overflow-y-auto">
              <p className="text-[15px] leading-7 text-slate-600 whitespace-pre-wrap">
                {text}
              </p>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex justify-end bg-slate-50/60">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { X } from 'lucide-react'

// interface ReadMoreProps {
//   text: string
//   wordLimit?: number
//   className?: string
// }

// export default function ReadMore({
//   text,
//   wordLimit = 30,
//   className = '',
// }: ReadMoreProps) {
//   const [showModal, setShowModal] = useState(false)
//   const modalRef = useRef<HTMLDivElement>(null)

//   const words = text.trim().split(/\s+/)
//   const isLong = words.length > wordLimit
//   const displayText = isLong
//     ? words.slice(0, wordLimit).join(' ') + '…'
//     : text

//   // Close modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         setShowModal(false)
//       }
//     }

//     if (showModal) {
//       document.addEventListener('mousedown', handleClickOutside)
//       document.body.style.overflow = 'hidden' // Prevent background scroll
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//       document.body.style.overflow = 'unset'
//     }
//   }, [showModal])

//   // Close modal on escape key
//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         setShowModal(false)
//       }
//     }

//     if (showModal) {
//       document.addEventListener('keydown', handleEscape)
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape)
//     }
//   }, [showModal])

//   return (
//     <div className={className}>
//       <p className="text-sm leading-6 text-muted-foreground">
//         {displayText}
//       </p>
//       {isLong && (
//         <button
//           onClick={() => setShowModal(true)}
//           className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded transition-colors"
//         >
//           Read More
//         </button>
//       )}

//       {/* Floating Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div
//             ref={modalRef}
//             className="relative max-w-2xl w-full max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-900">Full Text</h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                 aria-label="Close modal"
//               >
//                 <X className="h-5 w-5 text-gray-500" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6 overflow-y-auto max-h-[60vh]">
//               <p className="text-base leading-7 text-gray-700 whitespace-pre-wrap">
//                 {text}
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }