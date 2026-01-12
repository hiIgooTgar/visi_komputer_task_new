export default function Footer() {
  return (
    <footer className="border-t border-gray-800 p-6 mt-10 text-center text-gray-500 text-sm">
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          SmartCount
        </span>{" "}
        Pro - Real-time Object Counter & Reporter
      </p>
    </footer>
  );
}
