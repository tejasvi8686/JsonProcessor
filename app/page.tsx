import JsonProcessor from '@/components/JsonProcessor';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            JSON Data Processor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your JSON data and store it in Firebase with ease
          </p>
        </div>
        <JsonProcessor />
      </div>
    </div>
  );
}