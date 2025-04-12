import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import striptags from 'striptags';
import FilterSidebar from './filterSearch';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'all',
    jobType: 'all',
    remoteOnly: false
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://www.themuse.com/api/public/jobs?page=1");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const jobsWithExpandedFlag = data.results.map(job => ({
          ...job,
          isExpanded: false
        }));
        setJobs(jobsWithExpandedFlag);
        setFilteredJobs(jobsWithExpandedFlag); // Initialize with all jobs
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); 

  useEffect(() => {
    const filtered = jobs.filter(job => {
      // Search filter (checks multiple fields)
      const searchMatch = !filters.searchQuery || 
        job.name.toLowerCase().includes(filters.searchQuery) ||
        (job.company?.name && job.company.name.toLowerCase().includes(filters.searchQuery)) ||
        (job.contents && job.contents.toLowerCase().includes(filters.searchQuery));

      // Category filter
      const categoryMatch = filters.category === 'all' || 
        job.categories?.some(c => c.name === filters.category);

      // Job type filter
      const typeMatch = filters.jobType === 'all' || 
        (job.type && job.type.toLowerCase().includes(filters.jobType.toLowerCase()));

      // Remote filter
      const remoteMatch = !filters.remoteOnly || 
        job.locations?.some(l => l.name.toLowerCase().includes('remote'));
      
      return searchMatch && categoryMatch && typeMatch && remoteMatch;
    });
    setFilteredJobs(filtered);
  }, [jobs, filters]);

  const toggleJobContent = (index) => {
    const updatedJobs = [...filteredJobs];
    updatedJobs[index].isExpanded = !updatedJobs[index].isExpanded;
    setFilteredJobs(updatedJobs);
  };

  const handleApply = (e, job) => {
    e.stopPropagation();
    console.log('Applying to:', job.name);
    // Implement your actual apply logic here
    // Could be:
    // 1. Opening a modal with application form
    // 2. Redirecting to external application page
    // 3. Saving to "Applied Jobs" list
  };

  // Extract unique categories for filter options
  const uniqueCategories = [...new Set(
    jobs.flatMap(job => job.categories?.map(c => c?.name) || [])
  )].filter(Boolean);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse text-lg text-sky-600">Loading jobs...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-sky-50">
      {/* Sidebar Column - Hidden on mobile if you add responsive classes */}
      <div className="hidden md:block w-72 p-4">
        <FilterSidebar 
          filters={filters}
          setFilters={setFilters}
          categories={uniqueCategories}
        />
      </div>

      {/* Main Content Column */}
      <div className="flex-1 p-4">
        <Card className="w-full border-sky-200 shadow-lg">
          <CardHeader className="bg-sky-100 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sky-800">JOB LISTINGS</CardTitle>
                <CardDescription className="text-sky-600">
                  {filteredJobs.length === jobs.length 
                    ? `Showing all ${jobs.length} jobs` 
                    : `Showing ${filteredJobs.length} of ${jobs.length} jobs`
                  }
                </CardDescription>
              </div>
              {/* Mobile filter button would go here */}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 p-6">
            {filteredJobs.length > 0 ? (
              <ul className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <li 
                    key={`${job.id}-${index}`}
                    className={`p-6 border border-sky-200 rounded-lg transition-all bg-white cursor-pointer ${job.isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}
                    onClick={() => toggleJobContent(index)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-sky-900">{job.name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {job.company?.name && (
                            <p className="text-sky-700">{job.company.name}</p>
                          )}
                          {job.categories?.length > 0 && (
                            <p className="text-sm text-sky-600">
                              {job.categories.map(c => c?.name).filter(Boolean).join(', ')}
                            </p>
                          )}
                          {job.locations?.[0]?.name && (
                            <p className="text-sky-600">
                              {job.locations[0].name}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="bg-green-400 hover:bg-green-500 text-white border-green-500"
                        onClick={(e) => handleApply(e, job)}
                      >
                        Apply
                      </Button>
                    </div>
                    
                    {job.isExpanded && job.contents && (
                      <div className="mt-4 pt-4 border-t border-sky-100">
                        <h4 className="font-semibold text-sky-800 mb-2">Job Description:</h4>
                        <div className="prose prose-sm max-w-none text-sky-800">
                          {striptags(job.contents)}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12 space-y-4">
                <p className="text-lg text-sky-600">No jobs match your current filters</p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    searchQuery: '',
                    category: 'all',
                    jobType: 'all',
                    remoteOnly: false
                  })}
                  className="text-sky-600 border-sky-300"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Jobs;