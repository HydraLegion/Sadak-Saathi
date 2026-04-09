export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white border-t-4 border-orange-500 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="font-bold mb-2">Policies</h4>
          <ul className="space-y-1 text-blue-100">
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Important Links</h4>
          <ul className="space-y-1 text-blue-100">
            <li>india.gov.in</li>
            <li>MoRTH Official</li>
          </ul>
        </div>
        <div className="md:text-right">
          <p className="text-blue-100 text-xs">Designed, Developed and Hosted by</p>
          <p className="font-bold">National Informatics Centre (NIC)</p>
        </div>
      </div>
    </footer>
  );
}
