import React from "react";

export function Bookmarklet() {
  return (
    <div className="w-full max-w-lg text-center p-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Quick Save Bookmarklet
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Drag the button below to your bookmarks bar. Click it on any page to
        quickly save the link.
      </p>
      <a
        href={`javascript:(function(){window.open('${
          typeof window !== "undefined" ? window.location.origin : ""
        }/form?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title),'_blank');})();`}
        className="inline-block px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition shadow-sm"
        onClick={(e) => {
          e.preventDefault();
          alert("Drag this button to your bookmarks bar, don't click it!");
        }}
      >
        + Save to Seedlink
      </a>
    </div>
  );
}
