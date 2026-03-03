'use client'

import AppTable from "@/components/dashboard/AppTable";
import { useConfirm } from "@/components/providers/confirm-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQueryParams } from "@/hooks/use-query-params";
import { Asset } from "@/lib/asset";
import { createRoute } from "@/lib/createRoute";
import { Parser } from "@/lib/htmlParser";
import Str from "@/lib/str";
import { cn } from "@/lib/utils";
import { companyService } from "@/services/company.service";
import { jobService } from "@/services/job.service";
import { locationService } from "@/services/location.service";
import { Job, JobWithAppliedCount } from "@/types/models/job.model";
import { AppTableColumn, DropDownType, PaginationTypes } from "@/types/table-types";
import { FileInput, Link, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
interface DropDownData {
  companies: DropDownType[];
  locations: DropDownType[];
}
export default function JobsPage() {
  const confirm = useConfirm()
  const { queryParams, setOptions, options } = useQueryParams<JobWithAppliedCount>({
    search: "",
    page: 1,
    limit: 10,
    sortBy: "created_at",
    sortOrder: "DESC" as "ASC" | "DESC",
    company_id: undefined as string | undefined,
    location_id: undefined as string | undefined,
    status: undefined as string | undefined,
  });
  const [dropdowns, setDropdowns] = useState<DropDownData>({
    companies: [],
    locations: [],
  });
  const [jobs, setJobs] = useState<JobWithAppliedCount[]>([]);

  const [load, setLoad] = useState({
    getJobs: true,
    delete: false
  });

  const [total, setTotal] = useState(0);
  const router = useRouter();

  const getData = async () => {
    try {
      setLoad((prev) => ({ ...prev, getJobs: true }));
      const { data, error } =
        await jobService.findAllWithAppliedCount(queryParams);
      if (!error) {
        setJobs(data?.data.data || []);
        setTotal(data?.data.meta.total || 0);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoad((prev) => ({ ...prev, getJobs: false }));
    }
  };

  useEffect(() => {
    getData();
  }, [queryParams]);

  useEffect(() => {
    const fetchConfigs = async () => {
      const [companyRes, locationRes] = await Promise.all([
        companyService.findAllForDropDown(),
        locationService.findAllForDropDown(),
      ]);
      if (!companyRes.error) {
        setDropdowns((prev) => ({
          ...prev,
          companies: companyRes.data?.data || [],
        }));
      }
      if (!locationRes.error)
        setDropdowns((prev) => ({ ...prev, locations: locationRes.data?.data || [] }));
    };
    fetchConfigs();
  }, []);

  const handleDelete = async (job: JobWithAppliedCount) => {
    if (!await confirm({
      title: "Delete Job",
      description: `Are you sure you want to delete the job "${job.title}"? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    })) {
      return;
    }
    try {
      setLoad((prev) => ({ ...prev, delete: true }));
      const { error } = await jobService.remove(job.id);
      if (!error) {
        getData();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setLoad((prev) => ({ ...prev, delete: false }));
    }
  }

  const columns: AppTableColumn<JobWithAppliedCount>[] = [
    {
      label: 'Company',
      render: (row) => (
        <Avatar className="h-9 w-9 rounded-lg">
          <AvatarImage src={Asset.logoUrl((row as any).company?.logo_url)} alt={(row as any).company?.name} className="object-cover" />
          <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold">
            {Str.initials((row as any).company?.name ?? '?')}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      label: "Title",
      labelClass: "max-w-[200px]",
      cellClass: "max-w-[200px]",
      render: (row) => (
        <div>
          {Parser.htmlString2text(row.title, {
            wordCount: 5,
          })}
        </div>
      ),
    },
    {
      label: "Work Mode",
      cellClass: "text-center",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {Str.caseConverter(row.remote_type || '', { from: "snake", to: "normal" }) || "N/A"}
          </span>
        </div>
      ),
    },
    {
      label: "Job type",
      cellClass: "text-center",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {Str.caseConverter(row.job_type, { from: "snake", to: "normal" }) || "N/A"}
          </span>
        </div>
      ),
    },
    {
      label: "Featured",
      cellClass: "text-center",
      render: (row) => (
        <span className={cn("font-medium", row.is_featured ? "text-green-500" : "text-gray-500")}>
          {row.is_featured ? "Featured" : "Not Featured"}
        </span>
      ),
    },
    {
      label: "Status",
      cellClass: "text-center",
      render: (row) => (
        <Badge variant={"default"}>
          {Str.capitalize(
            Str.caseConverter(row.status, { from: "snake", to: "normal" }),
          )}
        </Badge>
      ),
    },
    {
      label: "Actions",
      labelClass: "text-right",
      cellClass: "text-right",
      render: (row) => (
        <AppTable.RowAction
          type="inline"
          menuItems={[
            {
              label: "Edit Details",
              icon: <Pencil className="h-4 w-4 text-cyan-900" />,
              onClick: () => {
                router.push(createRoute("/dashboard/jobs/:id", {
                  params: { id: row.job_id },
                }))
              },
            },
            {
              label: "Delete Job",
              icon: <Trash className="h-4 w-4 text-red-500" />,
              onClick: () => {
                handleDelete(row)
              },
            },
          ]}
        />
      ),
    },
  ];
  return (<AppTable>
    <div className="sm:flex justify-between px-6 mb-3 w-full">
      <AppTable.FilterItem
        type="text"
        debounce
        delay={600}
        onChange={(val) =>
          setOptions((prev) => ({ ...prev, search: val, page: 1 }))
        }
        placeholder="Search jobs..."
        className="w-37.5"
        clearable
        onClear={() =>
          setOptions((prev) => ({ ...prev, search: "", page: 1 }))
        }
      />
      <div className="sm:flex items-center gap-2">
        <AppTable.FilterItem
          type="select"
          options={dropdowns.companies?.map((item) => ({
            label: item.label,
            value: item.id.toString(),
          }))}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              page: 1,
              company_id: val || undefined,
            }))
          }
          placeholder="Filter by Company"
          className="w-37.5"
          clearable
          value={options.company_id}
          onClear={() =>
            setOptions((prev) => ({
              ...prev,
              page: 1,
              company_id: undefined,
            }))
          }
        />
        <AppTable.FilterItem
          type="select"
          options={dropdowns.locations?.map((item) => ({
            label: item.label,
            value: item.id.toString(),
          }))}
          onChange={(val) => {
            setOptions((prev) => ({
              ...prev,
              page: 1,
              location_id: val || undefined,
            }));
          }}
          placeholder="Filter by Location"
          className="w-37.5"
          clearable
          value={options.location_id}
          onClear={() =>
            setOptions((prev) => ({
              ...prev,
              page: 1,
              location_id: undefined,
            }))
          }
        />
        <AppTable.Button
          type="add"
          title="Add Job"
          onClick={() => {
            router.push(createRoute("/dashboard/jobs/post"))
          }}
        />
        <AppTable.Button
          type="refresh"
          title="Refresh Jobs"
          onClick={getData}
        />
      </div>
    </div>
    <div className="flex justify-between items-center mb-4 px-6 w-full">
      <AppTable.PaginationDetail
        page={options.page}
        limit={options.limit}
        total={total}
      >
        {({ itemStart, itemEnd, total }) => (
          <span className="text-sm text-muted-foreground">
            Showing {itemStart} - {itemEnd} of {total} jobs
          </span>
        )}
      </AppTable.PaginationDetail>

      <div className="flex items-center gap-2">
        <AppTable.Limit
          limit={options.limit}
          onLimitChange={(limit) =>
            setOptions((prev) => ({ ...prev, limit, page: 1 }))
          }
          limitOptions={[5, 10, 20, 50, 100]}
        />
        <AppTable.Pagination
          limit={options.limit}
          total={total}
          page={options.page}
          onPageChange={(page) => setOptions((prev) => ({ ...prev, page }))}
        />
      </div>
    </div>

    <AppTable.Body
      columns={columns}
      datalist={jobs}
      loading={load.getJobs}
      onRowClick={(row) =>
        router.push(
          createRoute("/dashboard/jobs/:id", {
            params: {
              id: row.job_id,
            },
          }),
        )
      }
      sortOptions={{
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
        onSortChange: (sortBy, sortOrder) =>
          setOptions((prev) => ({
            ...prev,
            sortBy: sortBy,
            sortOrder,
          })),
      }}
    />

    <div className="flex justify-between items-center mb-4 px-6 w-full">
      <AppTable.PaginationDetail
        page={options.page}
        limit={options.limit}
        total={total}
      >
        {({ itemStart, itemEnd, total }) => (
          <span className="text-sm text-muted-foreground">
            Showing {itemStart} - {itemEnd} of {total} jobs
          </span>
        )}
      </AppTable.PaginationDetail>

      <div className="flex items-center gap-2">
        <AppTable.Limit
          limit={options.limit}
          onLimitChange={(limit) =>
            setOptions((prev) => ({ ...prev, limit, page: 1 }))
          }
          limitOptions={[5, 10, 20, 50, 100]}
        />
        <AppTable.Pagination
          limit={options.limit}
          total={total}
          page={options.page}
          onPageChange={(page) => setOptions((prev) => ({ ...prev, page }))}
        />
      </div>
    </div>
  </AppTable>);
}
