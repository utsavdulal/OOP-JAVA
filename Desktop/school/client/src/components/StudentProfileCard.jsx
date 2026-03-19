import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function StudentProfileCard({ student, showFullDetails = false }) {
  if (!student) return null;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-24"></div>
      
      <div className="px-6 pb-6">
        {/* Photo and Name Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative -mt-12 w-28 h-28 flex-shrink-0">
            {student.photo ? (
              <img
                src={student.photo}
                alt={`${student.fullName}`}
                className="w-full h-full rounded-xl object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
                {student.fullName?.[0]}
              </div>
            )}
          </div>
          
          <div className="flex-1 mt-8">
            <h3 className="text-lg font-bold text-gray-900">{student.fullName}</h3>
            <p className="text-sm text-primary-600 font-semibold">{student.rollNumber}</p>
            {student.class && (
              <p className="text-xs text-gray-500 mt-1">{student.class} {student.section}</p>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
          {student.email && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiMail className="text-primary-500 flex-shrink-0" />
              <a href={`mailto:${student.email}`} className="hover:text-primary-600 break-all">
                {student.email}
              </a>
            </div>
          )}
          {student.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiPhone className="text-primary-500 flex-shrink-0" />
              <a href={`tel:${student.phone}`} className="hover:text-primary-600">
                {student.phone}
              </a>
            </div>
          )}
          {student.address && (
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <FiMapPin className="text-primary-500 flex-shrink-0 mt-1" />
              <span>{student.address}</span>
            </div>
          )}
        </div>

        {/* Additional Details if requested */}
        {showFullDetails && (
          <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
            {student.gender && (
              <div>
                <span className="text-gray-600">Gender:</span>
                <span className="ml-2 font-medium">{student.gender}</span>
              </div>
            )}
            {student.dateOfBirth && (
              <div>
                <span className="text-gray-600">Date of Birth:</span>
                <span className="ml-2 font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            {student.guardianName && (
              <div>
                <span className="text-gray-600">Guardian:</span>
                <span className="ml-2 font-medium">{student.guardianName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
