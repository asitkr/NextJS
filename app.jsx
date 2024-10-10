import { t } from 'i18next';
import { ArrowUpDown, PencilLineIcon } from 'lucide-react';
import React, { useState, useCallback, useMemo ,useEffect} from 'react';
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,} from '../../../@/components/ui/dialog';
import circle_plus from '../../../assets/circle_plus_icon.svg';
import CategorizeServiceDataTable from '../Common/categorize-service-data-table';
import {ColumnDef,SortingState,Table as ReactTable,flexRender,getCoreRowModel,getSortedRowModel,useReactTable,} from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import {Accordion,AccordionContent,AccordionItem,AccordionTrigger,} from '../../../@/components/ui/Common/Elements/Accordian/Accordian';
import { Button } from '../../../@/components/ui/Common/Elements/Button/Button';
import { Label } from '../../../@/components/ui/Common/Elements/Label/Label';
import { SkeletonCard } from '../../../@/components/ui/Common/Elements/Skeleton/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '../../../@/components/ui/Common/Table/Table';
import { z } from 'zod';
import { Input } from '../../../@/components/ui/Input';
import { Switch } from '../../../@/components/ui/switch';
import { Textarea } from '../../../@/components/ui/textarea';
import { RootState } from '../../../redux/store';
import {get_cookies_categories,post_create_category,get_cookies_cookiesetup,get_cookies_services,post_create_services,get_Next_Page_Data,post_create_cookies} from '../../common/services/cookie-consent-management';
import { useStepper } from '../../common/Stepper';
import CategorizeCookiesDataTable from '../Common/categorize-cookies-data-table';
import Navbar from './CustomizeBanner/navbar';
import { RegisterOptions, SubmitHandler, useForm, UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AddService from '../../cookie-configuration/AddService';
import ShadcnDialog from '../../common/shadcn-dialog';
import AddCookie from '../../cookie-configuration/AddCookie';
interface ResponseDataProperties {
  default_opt_out: boolean;
  description: string;
  domain_id?: number;
  id?: number;
  is_necessary: boolean;
  is_unclassified: boolean;
  name: string;
  action?: boolean;
}
type Inputs1 = {
  service: string
  description: string
  privacy_policy_link:string
}
const cookieSchema = z.object({
  cookie_key: z.string().min(1, "Cookie Key is required"),
  description: z.string().min(1, "Description is required"),
  path: z.string().min(1, "Path is required"),
  cookie_type: z.string().min(1, "Cookie Type is required"),
  expiration: z.string().min(1, "Expiration is required"),
  vendor_name: z.string().min(1, "Vendor Name is required"),
  is_necessary_cookie: z.boolean().optional(), 
  status: z.boolean().optional(),
  show_status: z.boolean().optional(),
});
const cookieSchema1 = z.object({
  category_name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  is_necessary_cookie1: z.boolean().optional(),
  defaultOptOutValue: z.boolean().optional(),
  unclassifiedValue: z.boolean().optional()
});
const responseData = [
  {
    name: '',
    description: '',
    is_necessary: false,
    is_unclassified: true,
    default_opt_out: true,
    action: false,
  },
];
const commonDesc="These Cookies are essential to support core site functionality such as providing secure log-in."
const CategorizeCookie = () => {  
  const {register,handleSubmit,watch,setValue,formState: { errors },} = useForm({resolver: zodResolver(cookieSchema),})
  const { register:register3, handleSubmit:handleSubmit3, watch:watch3, setValue:setValue3, formState:{ errors:errors3 },} = useForm({resolver: zodResolver(cookieSchema1),})
  const onSubmit3 = async(data: any) => {
    try {
      const responseData = await post_create_category(
        {
          "domain_id": 32,
          "name": data.category_name,
          "description": data.description,
          "is_necessary": data. is_necessary_cookie1,
          "is_unclassified": true,
          "default_opt_out": data.defaultOptOutValue
        }
      );
      console.log("RESSS",responseData);
    } catch (error) {
      console.log("RROR",error);
    }
    
  }
  const { register:register1, handleSubmit:handleSubmit1, watch:watch1, formState: { errors:errors1 },} = useForm<Inputs1>()
  const onSubmit1: SubmitHandler<Inputs1> =async (data) => {
    console.log("TABL",data)
    try {
      const responseData = await post_create_services({
        "domain_id": 32,
        "cookie_category_id": 53,
        "name": data.service,
        "description": data.description,
        "privacy_policy_link": data.privacy_policy_link
      }
      );
      console.log("RESSS",responseData);
    } catch (error) {
      console.log(error);
    } 
  }
  const onSubmit = async(data: any) => {
    console.log("DDDATTA",data);
    try {
      const responseData = await post_create_cookies(
        {
          "cookie_key": data.cookie_key ,
          "customer_id": 496,
          "domain_id": 32,
          "category_id": 2,
          "cookie_service_id": 1,
          "vendor_name": data.vendor_name,
          "path": data.path,
          "cookie_type": data.cookie_type,
          "expiration": data.expiration,
          "description": data.description,
          "is_necessary_cookie": data.is_necessary_cookie,
          "status": data.status,
          "show_status": data.show_status
        }
      );
      console.log("RESSS",responseData);
    } catch (error) {
      console.log("RROR",error);
    }
    
  }
  const [defaultOptOutValue,setDefaultOptOutValue]=useState(false)
  const [unclassifiedValue,setUnclassifiedValue]=useState(false)
  const { nextStep } = useStepper();
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ResponseDataProperties | null>(null);
  const [isActionEdit, setIsActionEdit] = useState<boolean>(false);
  const [isNecessaryCookie, setIsNecessaryCookie] = useState(false);
  const [isNecessaryCookie1, setIsNecessaryCookie1] = useState(false);
  const [statusValue, setStatusValue] = useState(false);
  const [showStatusValue, setShowStatusValue] = useState(false);
  const [date, setDate] = useState<Date>();
  const [servicesData,setServicesData]=useState([]);
  const [cookieTableData,setCookieTableData]=useState([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showServiceDialog,setShowServiceDialog]=useState<boolean>(false);
  const [isEditService, setIsEditService] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showCookieDialog,setShowCookieDialog]=useState<boolean>(false)
  const [isEditCookie, setIsEditCookie] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('0');
  const [essentialCookies, setEssentialCookies] = useState<ResponseDataProperties>( {
    default_opt_out: false,
    description: '',
    is_necessary: false,
    is_unclassified: false,
    name: '',
  },);
  const [unclassifiedCookies, setUnclassifiedCookies] = useState<ResponseDataProperties>({
    default_opt_out: false,
    description: '',
    is_necessary: false,
    is_unclassified: false,
    name: '',
  });
  const [categoryDialogData, setCategoryDailogData] = useState<ResponseDataProperties>({
    default_opt_out: false,
    description: '',
    is_necessary: false,
    is_unclassified: false,
    name: '',
  });
  const [categoryDailogError, setCategoryDailogError] = useState({
    default_opt_out: false,
    description: false,
    is_necessary: false,
    name: false,
  });
  const [cookiesCategoriesKeys, setCookiesCategoriesKeys] = useState<Array<ResponseDataProperties>>(
    []
  );
  const domain_id: number = useSelector(
    (state: RootState) =>
      state?.cookieConsentManagement?.CookieConsentDomain?.cookieConfiguration?.domain_id
  );
  const tabData = ['Category', 'Service', 'Cookie'];
  const handleNext = async() => { const data=await get_Next_Page_Data(); nextStep();};
  const toHumanReadable = (value: string): string => {return value.replaceAll('_', ' ').replaceAll(/\b\w/g, (char) => char.toUpperCase());};
  const handleAction = useCallback((row: ResponseDataProperties) => {
    setSelectedRow(row);
    setShowActionDialog(true);
  }, []);
  const generateColumns = (data: ResponseDataProperties[]): ColumnDef<ResponseDataProperties>[] => {
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]) as (keyof ResponseDataProperties)[];
    return keys.map((key) => ({
      accessorKey: key,
      header: ({ column }) => (
        <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>{toHumanReadable(key as string)}
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => { 

      return key === 'action' ? (
        <PencilLineIcon className="size-4 cursor-pointer" onClick={() => handleAction(row.original)} />
        ) : key === 'is_necessary' || key === 'is_unclassified' || key === 'default_opt_out' ? (
          <Switch checked={row.getValue(key)} />
        ) : (
          <div className="">{row.getValue(key)}</div>
        );
      },
    }));
  };   
  const columns = useMemo(() => generateColumns(responseData), [responseData, generateColumns]);
  const essentialTable = useReactTable({data: [essentialCookies],columns,onSortingChange: setSorting,getCoreRowModel: getCoreRowModel(),getSortedRowModel: getSortedRowModel(),state: {sorting,},});

  const unclassifiedCookiesTable = useReactTable({ data: [unclassifiedCookies], columns, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), state: {sorting,},});
  const categoryDailogDataTable = useReactTable({ data: [categoryDialogData], columns, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), state: {sorting,},});
  const groupCookies = (data: any) => {
    const groupedData: any = {};
    for (const index of data) {
      const currentCategorieName = index['name'];
      groupedData[currentCategorieName] = groupedData[currentCategorieName]
        ? groupedData[currentCategorieName]?.push(index) : [index];
    }
    return groupedData;
  };
  useEffect(() => {
    const fetchCookieCategories = async () => {
      try {
        const responseData = await get_cookies_categories(domain_id);
        const groupedData = groupCookies(responseData?.result?.data);
        setCookiesCategoriesKeys(responseData?.result?.data);
        setEssentialCookies(responseData?.result?.data[0]);
        setCategoryDailogData(responseData?.result?.data[1]);
        setUnclassifiedCookies(responseData?.result?.data[2]);
        const rData = await get_cookies_services();
        const formattedData = rData?.result?.data.map((a: any) => ({ service_Name: a.name, category: a.category_name, description: a.description, link: a.privacy_policy_link, action:''}));
        setServicesData(formattedData); 
        const c_data=await get_cookies_cookiesetup();
        const cookie_data= c_data?.result?.data.map((a: any) => ({
          service: '-',
          vendor_name: a.vendor_name,
          categories: a.cookie_category_name,
          expiration: a.expiration,
          cookie_key:a.cookie_key,
          path: a.path,
          cookie_type: a.cookie_type,
          description: a.description,
          isNecessaryCookie: a.is_necessary_cookie,
          vendor_privacy_policy_link: a.vendor_privacy_policy_link,
          httpOnly: a.HttpOnly,
          secure: a.secure,
          status_changed_at: a.status_changed_at,
          show_status_changed_at: a.show_status_changed_at,
          created_at: a.created_at,
          updated_at: a.updated_at,
          action:''
        }));
        setCookieTableData(cookie_data)
      } catch (error) {
        console.log(error);
        setEssentialCookies({ default_opt_out: false, description: '', is_necessary: false, is_unclassified: false, name: '',});
        setUnclassifiedCookies( { default_opt_out: false, description: '', is_necessary:false, is_unclassified: false, name: '',});
      }
    };
    fetchCookieCategories();
  }, []);
  const handleCreateCookieCategory = async () => {
    if ( !categoryDialogData?.name || !categoryDialogData?.description || !categoryDialogData?.is_necessary || !categoryDialogData?.default_opt_out
    ) {
      setCategoryDailogError(
        categoryDialogData?.name
          ? categoryDialogData?.description
            ? categoryDialogData?.is_necessary
              ? categoryDialogData?.default_opt_out
                ? { name: true, description: true, is_necessary: true, default_opt_out: true }
                : { ...categoryDailogError, default_opt_out: true }
              : { ...categoryDailogError, is_necessary: true }
            : { ...categoryDailogError, description: true }
          : { ...categoryDailogError, name: true }
      );
    } else {
      try {
        const responseData = await post_create_category({ domain_id: domain_id, name: categoryDialogData?.name, description: categoryDialogData?.description, is_necessary: categoryDialogData?.is_necessary, is_unclassified: false, default_opt_out: categoryDialogData?.default_opt_out,});
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
    <ShadcnDialog   open={showCookieDialog}
      onOpenChange={() => {setShowCookieDialog(false); setIsEditCookie(false);}}
      title={isEdit ? 'Edit Cookie' : 'Add Cookie'}
      description={commonDesc}
      children={<AddCookie  
        register={register}
        errors={errors}
        isNecessaryCookie={isNecessaryCookie}
        setIsNecessaryCookie={setIsNecessaryCookie}
        statusValue={statusValue}
        setStatusValue={setStatusValue}
        showStatusValue={showStatusValue}
        setShowStatusValue={setShowStatusValue}
        setValue={setValue}
        />}
      footer={ <DialogFooter className="mt-2">
        <Button onClick={() => {setShowCookieDialog(false); setIsEditCookie(false);}}>Cancel</Button><Button
          onClick={handleSubmit(onSubmit)}
        >{isEdit ? 'Update' : 'Create'}</Button>
      </DialogFooter>}
      />
      <Dialog open={showDialog} onOpenChange={() => { setShowDialog(false); setIsEdit(false);}}>
      
        <DialogContent className="h-auto overflow-auto sm:max-w-[50%]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#64748B]">
              {isEdit ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
            <DialogDescription>{commonDesc}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
      <Label htmlFor="name" className="font-medium text-[#09090B]">Category Name</Label>
      <Input
        id="name"
        placeholder="Write"
        {...register3('category_name', { required: true })}
      />
      {errors3?.category_name && <p className="text-[red]">This field is required</p>}
    </div>
    <Label htmlFor="description" className="font-medium text-[#09090B]">Description</Label>
    <Textarea
      id="description"
      placeholder="Write"
      {...register3('description', { required: true })}
    />
    {errors3?.description && <p className="text-[red]">This field is required</p>}
      <div className="mt-5 flex w-full flex-row flex-wrap items-center justify-center gap-10 whitespace-nowrap text-sm font-medium">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <Label>Necessary</Label>
            <Switch
              checked={isNecessaryCookie1}
              onCheckedChange={(checked) => {
                setIsNecessaryCookie1(checked);
                setValue3('is_necessary_cookie1', checked);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
    <Label>Default Opt Out</Label>
    <Switch checked={defaultOptOutValue} onCheckedChange={(checked) => { setDefaultOptOutValue(checked); setValue3('defaultOptOutValue', checked);}}/>
  </div>
  <div className="flex flex-row items-center gap-2">
    <Label>UnClassified</Label>
    <Switch
      checked={unclassifiedValue}
      onCheckedChange={(checked) => {
        setDefaultOptOutValue(checked); 
        setValue3('unclassifiedValue', checked);
      }}
    />
  </div>


      
      </div>
          <DialogFooter className="mt-2">
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={() => {
                setShowDialog(false);
                setIsEdit(false);
              }}
            >{t('Common.Cancel')}</Button>
            <Button onClick={handleSubmit3(onSubmit3)} >{t('Common.Create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ShadcnDialog  open={showServiceDialog}   onOpenChange={() => {
        setShowServiceDialog(false);
        setIsEditService(false);
      }} title={isEdit ? 'Edit Cookie' : 'Add Cookie'}   description={commonDesc}  children={<AddService register1={register1 } errors1={errors1} />}   footer={<DialogFooter className="mt-2">
        <Button onClick={() => { setShowServiceDialog(false); setIsEditService(false);}}>Cancel</Button>
        <Button onClick={handleSubmit1(onSubmit1)}>{isEdit ? 'Update' : 'Create'}</Button>
      </DialogFooter>}  dialogContentClassName="h-auto max-h-[80vh] overflow-y-auto sm:max-w-[50%]"/>
     
      
      <div className="flex sm:flex-col sm:gap-3 md:flex-col md:gap-3">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleNext={handleNext}
          tabData={tabData}
        />
        {activeTab === '0' ? (<> {cookiesCategoriesKeys?.map((item, index) => {
  return (
    <Accordion
      key={index}
    >
      <AccordionItem value={item-${index}} className="border-0">
        <AccordionTrigger className="border-0 p-0 hover:no-underline">
          <div className="flex flex-col items-start">
            <p className="text-lg font-normal text-secondary-text">{item?.name}</p>
            <p className="text-xs font-normal text-secondary-text">12 Cookies</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex h-fit flex-col gap-2 pl-4">
          <hr className="bg-primary-border" />

          {item?.name === 'essential' ? (
            <DynamicTable essentialTable={essentialTable} columns={columns} />
          ) : (
            <>
              {item?.name === 'Functional Cookies' ? (<DynamicTable essentialTable={unclassifiedCookiesTable} columns={columns} />) : (<DynamicTable essentialTable={categoryDailogDataTable} columns={columns} />)}
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
})}
            <div onClick={() => setShowDialog(true)}>
              <img src={circle_plus} alt="add icon" />
              <p className="text-xs font-medium text-secondary-text">Add Category</p>
            </div>
          </>
        ) : (activeTab === '1' ? (
          <>
          <div className="min-w-[200px] rounded-lg border border-primary-border bg-primary-background p-2">
            <CategorizeServiceDataTable data={servicesData} loading={false} />
          </div>
          <div onClick={() => setShowServiceDialog(true)}>
              <img src={circle_plus} alt="add icon" />
              <p className="text-xs font-medium text-secondary-text">Add Services</p>
            </div>
          </>
        ) : (
          <>
          <CategorizeCookiesDataTable data={cookieTableData} loading={false} />
          <div onClick={() => setShowCookieDialog(true)}>
              <img src={circle_plus} alt="add icon" />
              <p className="text-xs font-medium text-secondary-text">Add Cookies</p>
            </div>
          </>
        ))}
              </div>    
    </>
  );
};

export default CategorizeCookie;

interface DynamicTableProps<T> { essentialTable: ReactTable<T>; columns: Array<any>; // Adjust this type based on your column definition}

const DynamicTable = <T extends unknown>({ essentialTable, columns }: DynamicTableProps<T>) => {
  return (
    <Table>
      <TableHeader>
        {essentialTable.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>{header.isPlaceholder ? undefined : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {essentialTable.getRowModel().rows.length > 0 ? (
          essentialTable.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (<TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No result.</TableCell></TableRow>)}
      </TableBody>
    </Table>
  );
};

when we call an action to set a state but page will not rerendred to open dialog
